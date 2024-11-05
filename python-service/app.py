from flask import Flask, request, jsonify
import librosa  
import numpy as np
from io import BytesIO

app = Flask(__name__)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    print('Processing audio file...');
    audio_file = request.files.get('audioFile')

    print('Recieved audio file:', audio_file)

    if audio_file is None:
        return jsonify({'error': 'No file uploaded'}), 400
    
    audio_file = BytesIO(audio_file.read())

    # Load the audio file
    audio, sr = load_audio(audio_file)

    # Extract features
    mfccs, rms, pitches, zcr, hop_length = extract_features(audio, sr)

    # Calculate articulation levels
    articulation_levels = calculate_articulation_level(rms, zcr)

    # Detect variable sections
    variable_sections, timbre_variability, loudness_variability, pitch_diff_variability = detect_variable_sections(mfccs, rms, pitches, sr, hop_length)

    # Normalize the extracted features
    time_axis = np.arange(len(timbre_variability)) * (hop_length * 25) / sr
    timbre_variability_normalized = (timbre_variability - np.min(timbre_variability)) / (np.max(timbre_variability) - np.min(timbre_variability))
    loudness_variability_normalized = (loudness_variability - np.min(loudness_variability)) / (np.max(loudness_variability) - np.min(loudness_variability))
    pitch_diff_variability_normalized = (pitch_diff_variability - np.min(pitch_diff_variability)) / (np.max(pitch_diff_variability) - np.min(pitch_diff_variability))
    articulation_levels_normalized = (articulation_levels - np.min(articulation_levels)) / (np.max(articulation_levels) - np.min(articulation_levels))

    # Convert all numpy arrays to lists
    response = {
        'mfccs': mfccs.tolist(),  
        'rms': rms.tolist(),
        'pitches': pitches.tolist(),
        'zcr': zcr.tolist(),
        'hop_length': hop_length,
        'sample_rate': sr,
        'articulation_levels': articulation_levels.tolist(),
        'variable_sections': variable_sections.tolist(),
        'timbre_variability': timbre_variability.tolist(),
        'loudness_variability': loudness_variability.tolist(),
        'pitch_diff_variability': pitch_diff_variability.tolist(),
        'normalized_time_axis': time_axis.tolist(),
        'normalized_timbre_variability': timbre_variability_normalized.tolist(),
        'normalized_loudness_variability': loudness_variability_normalized.tolist(),
        'normalized_pitch_variability': pitch_diff_variability_normalized.tolist(),
        'normalized_articulation_variability': articulation_levels_normalized.tolist(),
    }

    # Ensure all elements in the response are JSON serializable
    for key, value in response.items():
        if isinstance(value, np.ndarray):
            response[key] = value.tolist()

    return jsonify(response)

@app.route('/')
def home():
    return "Welcome to the Audio Processing API!"

def load_audio(file_path):
    """
    Load an audio file.

    Parameters:
    file_path (str): Path to the audio file.

    Returns:
    tuple: A tuple containing the audio time series and the sampling rate.
    """
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr

def extract_features(audio, sr):
    """
    Extract various audio features from an audio time series.

    Parameters:
    audio (numpy.ndarray): Audio time series.
    sr (int): Sampling rate of the audio time series.

    Returns:
    tuple: A tuple containing the following features:
        - mfccs (numpy.ndarray): Mel-frequency cepstral coefficients (MFCCs).
        - rms (numpy.ndarray): Root Mean Square (RMS) Energy.
        - pitches (numpy.ndarray): Pitch values.
        - zcr (numpy.ndarray): Zero-Crossing Rate (ZCR).
        - hop_length (int): Number of samples between successive frames.
    """
    # Parameters for frame length and hop size
    n_fft = 2048
    hop_length = 512

    # Extracting MFCCs
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13, n_fft=n_fft, hop_length=hop_length)

    # Extracting Root Mean Square (RMS) Energy
    rms = librosa.feature.rms(y=audio, frame_length=n_fft, hop_length=hop_length)

    # Extracting Pitch (using librosa's yin)
    pitches = librosa.yin(audio, fmin=librosa.note_to_hz('F3'), fmax=librosa.note_to_hz('B6'), sr=sr, hop_length=hop_length)

    # Extracting Zero-Crossing Rate (ZCR)
    zcr = librosa.feature.zero_crossing_rate(y=audio, frame_length=n_fft, hop_length=hop_length)

    return mfccs, rms, pitches, zcr, hop_length

def calculate_articulation_level(rms, zcr, window_size=100, hop_size=25):
    articulation_levels = []
    num_frames = rms.shape[1]

    # Calculate mean and std across all windows for RMS and ZCR
    rms_diff_values = []
    zcr_values = []
    for start in range(0, num_frames - window_size + 1, hop_size):
        window_rms = rms[0][start:start + window_size]
        rms_diff = np.mean(np.abs(np.diff(window_rms)))
        rms_diff_values.append(rms_diff)

        window_zcr = zcr[0][start:start + window_size]
        zcr_mean = np.mean(window_zcr)
        zcr_values.append(zcr_mean)

    rms_diff_mean = np.mean(rms_diff_values)
    rms_diff_std = np.std(rms_diff_values)
    zcr_mean_overall = np.mean(zcr_values)
    zcr_std_overall = np.std(zcr_values)

    # Calculate articulation level for each window
    for start in range(0, num_frames - window_size + 1, hop_size):
        # RMS Difference
        window_rms = rms[0][start:start + window_size]
        rms_diff = np.mean(np.abs(np.diff(window_rms)))
        if rms_diff_std != 0:
            rms_diff_standardized = (rms_diff - rms_diff_mean) / rms_diff_std
        else:
            rms_diff_standardized = rms_diff - rms_diff_mean

        # ZCR
        window_zcr = zcr[0][start:start + window_size]
        zcr_mean = np.mean(window_zcr)
        if zcr_std_overall != 0:
            zcr_standardized = (zcr_mean - zcr_mean_overall) / zcr_std_overall
        else:
            zcr_standardized = zcr_mean - zcr_mean_overall

        # Articulation Level (0 = staccato, 1 = legato)
        alpha = 0.5
        articulation_level = 1 - (alpha * rms_diff_standardized + (1 - alpha) * zcr_standardized)
        articulation_levels.append(articulation_level)

    return np.array(articulation_levels)

def detect_variable_sections(mfccs, rms, pitches, sr, hop_length):
    # Parameters for section analysis
    window_size = 100  # 100 frames per window
    hop_size = 25  # 25 frames hop between windows

    # Calculate variability in timbre (MFCCs) using a sliding window
    timbre_variability = []
    num_frames = mfccs.shape[1]
    for start in range(0, num_frames - window_size + 1, hop_size):
        window_mfccs = mfccs[:, start:start + window_size]
        window_std = np.std(window_mfccs, axis=1)  # Standard deviation for each MFCC
        avg_std = np.mean(window_std)  # Average standard deviation across all 13 MFCCs
        timbre_variability.append(avg_std)
    timbre_variability = np.array(timbre_variability)
    max_timbre_idx = np.argmax(timbre_variability)

    # Calculate variability in loudness (RMS) using a sliding window
    loudness_variability = []
    for start in range(0, num_frames - window_size + 1, hop_size):
        window_rms = rms[0][start:start + window_size]
        window_std = np.std(window_rms)  # Standard deviation of RMS in the window
        loudness_variability.append(window_std)
    loudness_variability = np.array(loudness_variability)
    max_loudness_idx = np.argmax(loudness_variability)

    # Calculate pitch differences from piano notes using a sliding window
    pitch_diff_variability = []
    for start in range(0, len(pitches) - window_size + 1, hop_size):
        window_pitches = pitches[start:start + window_size]
        window_pitch_diffs = []
        for pitch in window_pitches:
            # Find nearest piano note frequency
            midi_note = librosa.hz_to_midi(pitch)
            nearest_note_hz = librosa.midi_to_hz(round(midi_note))
            pitch_diff = abs(pitch - nearest_note_hz)
            window_pitch_diffs.append(pitch_diff)
        avg_pitch_diff = np.mean(window_pitch_diffs)  # Average pitch difference in the window
        pitch_diff_variability.append(avg_pitch_diff)
    pitch_diff_variability = np.array(pitch_diff_variability)
    max_pitch_diff_idx = np.argmax(pitch_diff_variability)

    # Get sample indices for the most significant sections (2.32-second segments)
    segment_length = int(2.32 * sr)
    timbre_section = (max_timbre_idx * hop_size * hop_length) // segment_length * segment_length
    loudness_section = (max_loudness_idx * hop_size * hop_length) // segment_length * segment_length
    pitch_diff_section = (max_pitch_diff_idx * hop_size * hop_length) // segment_length * segment_length

    variable_sections = [
        [timbre_section, timbre_section + segment_length],
        [loudness_section, loudness_section + segment_length],
        [pitch_diff_section, pitch_diff_section + segment_length]
    ]

    return np.array(variable_sections), timbre_variability, loudness_variability, pitch_diff_variability

if __name__ == '__main__':
    app.run(debug=True, port=8080)

import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-500 text-white text-center py-2 fixed bottom-0 w-full shadow-[-0px_-4px_10px_-2px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto text-center justify-center">
        <div className="text-sm">
          © {new Date().getFullYear()} SkyNote. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

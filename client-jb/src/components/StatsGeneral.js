import React, { useEffect, useState } from 'react'
import StatsGeneralCSS from './StatsGeneral.module.css'

const StatsGeneral = (props) => {
  const [numRec, setNumRec] = useState(null)
  const [numMes, setNumMes] = useState(null)
  const [numTask, setNumTask] = useState(null)

  useEffect(() => {
    if (props.numberRecordings !== null) {
      const recNames = props.numberRecordings
      setNumRec(recNames.length)
      const unreadMessages = props.unreadMessages
      setNumMes(unreadMessages)
      const unansweredTasks = props.unansweredTasks
      setNumTask(unansweredTasks)
    }
  }, [props])

  return (
    <div className={StatsGeneralCSS.container}>
      <h4 className={StatsGeneralCSS.title}>General Information</h4>
      <div>
        <ul className={StatsGeneralCSS.list}>
          <li className={StatsGeneralCSS.entry}>
            Pending tasks to submit: {numTask}
          </li>
          <li className={StatsGeneralCSS.entry}>
            Pending messages to read: {numMes}
          </li>
          <li className={StatsGeneralCSS.entry}>
            Total number of recordings: {numRec}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default StatsGeneral

import React from 'react'

export interface ProgressBarProps {
  questions: Array<string>,
  isDone: boolean,
  curr:number,
  highlight: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  questions,
  isDone,
  curr,
  highlight
}) => {
  let styles: {
    current: any;
    StepProgress: any;
    wrapper: any;
    item:any;
    highlight:any
  };

  if (isDone){
    styles = require('./done.module.scss')
  } else {
    styles = require('./in_progress.module.scss')
  }

  let offset = 1;
  if (questions.length === 9)
    offset = 12;

  const questionList = questions.map((q, index) => {
    if (index == curr)
      return <div className={[styles.item, styles.highlight, styles.current].join(' ')} key={"question-"+q}>{q}</div>
    if (index < highlight)
      return <div className={[styles.item, styles.highlight].join(' ')} key={"question-"+q}><a href={"/questions/" + (index + offset)}>{q}</a></div>
    else
      return <div className={styles.item} key={"question-"+q}>{q}</div>

  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.StepProgress}>
        {questionList}
      </div>
    </div>
  )
}

export default ProgressBar

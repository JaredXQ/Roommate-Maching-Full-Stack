import styles from "./details.module.scss"
import React from "react";
import {Link} from "react-router-dom";

export const infoQ1 = <div className={styles.boxQuestion}>
  <div className={styles.questionBox}>Name of your college:</div>
  <input type="text" className={styles.inputBox} required={true} />
  <Link to="/questions/2" style={{ textDecoration: 'none' }} >
    <div className={styles.btn}>Submit</div>
  </Link>
  </div>

export const infoQ2 = <div className={styles.boxQuestion}>
  <div className={styles.questionBox}>Name of your college:</div>
  <span>{"Major  "} <input type="text" className={styles.inputBox} required={true} /></span>
  <span>{"Degree "} <input type="text" className={styles.inputBox} required={true} /></span>
  <span>{"Year   "} <input type="text" className={styles.inputBox} required={true} /></span>
  <Link to="/questions/3" style={{ textDecoration: 'none' }} >
    <div className={styles.btn}>Submit</div>
  </Link>
</div>

export const infoQ3 = <div className={styles.ternaryQuestion}>
  <div className={styles.questionBox}>Your gender</div>
  <div className={styles.choices}>
    <span className={styles.choice1}>Male</span>
    <span className={styles.choice2}>Non-Binary</span>
    <span className={styles.choice3}>Female</span>
  </div>
</div>

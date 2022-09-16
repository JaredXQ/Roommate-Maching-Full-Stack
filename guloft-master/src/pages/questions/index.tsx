import React, { useState } from 'react'
import styles from './index.module.scss'
import Navbar from '../../components/navbar'
import classNames from 'classnames'
import { useLoginContext, useRequireLogin } from '../../contexts/login-context'
import { useNavigate } from 'react-router'
import Axios from 'axios'

const filterInt = function (value: string) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value)
  return NaN
}

const Questions: React.FC = () => {
  useRequireLogin()
  const { token } = useLoginContext()
  // personal infos
  const [school, setSchool] = useState<string>('')
  const [major, setMajor] = useState<string>('')
  const [year, setYear] = useState<number>(-1)
  const [degree, setDegree] = useState<string>('')
  const [gender, setGender] = useState<number>(-1) //0 male, 1 non binary, 2 female
  const [bedtime, setBedtime] = useState<string>('')
  const [cook, setCook] = useState<number>(-1)
  const [smoke, setSmoke] = useState<number>(-1)
  const [introvert, setIntrovert] = useState<number>(-1)
  const [pets, setPets] = useState<number>(-1)
  const [clean, setClean] = useState<number>(-1)
  const [music, setMusic] = useState<number>(-1)

  //matching info?
  const [sameMajor, setSameMajor] = useState<number>(-1)
  const [diffGender, setDiffGender] = useState<number>(-1)
  const [roommateSmoke, setRoommateSmoke] = useState<number>(-1)
  const [sleepSchedule, setSleepSchedule] = useState<number>(-1)
  const [eatTogether, setEatTogether] = useState<number>(-1)
  const [outgoing, setOutgoing] = useState<number>(-1)
  const [roommatePet, setRoommatePets] = useState<number>(-1)
  const [roommateClean, setRoommateClean] = useState<number>(-1)
  const [roommateMusic, setRoommateMusic] = useState<number>(-1)

  const navigate = useNavigate()

  const handleSchoolYear = (newSchoolYear: string) => {
    const year = filterInt(newSchoolYear)
    if (isNaN(year) || year < new Date().getFullYear()) {
      setYear(-1)
    } else {
      setYear(year)
    }
  }

  // Axios.get(process.env.REACT_APP_BACKEND_DOMAIN + '/p-info/me').then(res => {
  //   if (res.data.college != "")
  //     setSchool(res.data.college);
  //   if (res.data.degree != "")
  //     setSchool(res.data.degree);
  //   if (res.data.year != "")
  //     setYear(parseInt(res.data.year));
  //   if (res.data.gender != "") {
  //     if (res.data.gender === "male")
  //       setGender(0);
  //     else if (res.data.gender === "non-binary")
  //       setGender(1);
  //     else
  //       setGender(2);
  //   }
  // }).catch(e=>{
  //   console.log("oops");
  // });

  const sendInfo = () => {
    console.log('sending')
    let tmpGender
    if (gender === 0) {
      tmpGender = 'male'
    } else if (gender === 1) {
      tmpGender = 'non-binary'
    } else {
      tmpGender = 'female'
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    Axios.put(
      process.env.REACT_APP_BACKEND_DOMAIN + '/p-info-all/me',
      {
        major: major,
        gender: tmpGender,
        smoke: smoke == 1 ? 'true' : 'false',
        sleeping_schedule: bedtime,
        cook: cook == 1 ? 'true' : 'false',
        introverted: introvert.toString(),
        pets: pets.toString(),
        clean: clean.toString(),
        year: year.toString(),
        degree: degree,
        college: school,
        loud_sounds: music == 1 ? 'true' : 'false',
      },
      config,
    )
      .then(res => {
        console.log(res)
        console.log('submit clicked')
        Axios.put(
          process.env.REACT_APP_BACKEND_DOMAIN + '/m-info-all/me',
          {
            major: sameMajor == 1 ? 'true' : 'false',
            gender: diffGender == 1 ? 'true' : 'false',
            smoke: roommateSmoke.toString(),
            sleeping_schedule: sleepSchedule.toString(),
            cook: eatTogether.toString(),
            introverted: outgoing == 1 ? 'true' : 'false',
            pets: roommatePet.toString(),
            clean: roommateClean.toString(),
            loud_sounds: roommateMusic == 1 ? 'true' : 'false',
          },
          config,
        )
          .then(() => {
            console.log('submit clicked')

            //!TODO: move to matching page
            navigate('/matching')
          })
          .catch(() => {
            alert('Failed to send info to server, please retry!')
          })
      })
      .catch(() => {
        alert('Failed to send info to server, please retry!')
      })
  }

  const submitInfos = () => {
    if (
      school === '' ||
      major === '' ||
      year === -1 ||
      gender === -1 ||
      bedtime === '' ||
      cook === -1 ||
      smoke === -1 ||
      introvert === -1 ||
      pets === -1 ||
      clean === -1 ||
      music === -1 ||
      sameMajor === -1 ||
      diffGender === -1 ||
      roommateSmoke === -1 ||
      sleepSchedule === -1 ||
      eatTogether === -1 ||
      outgoing === -1 ||
      roommatePet === -1 ||
      roommateClean === -1 ||
      roommateMusic === -1
    ) {
      alert('Info incomplete!')
    } else {
      sendInfo()
    }
  }

  return (
    <div>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.sectionTag}>Personal Info</div>

        <div className={styles.question}>
          <div className={school === '' ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your school?</div>
          <input
            className={
              school === '' ? styles.questionTodo : styles.questionName
            }
            type="text"
            placeholder="UIUC"
            onChange={e => setSchool(e.target.value)}
          />
        </div>

        <div className={styles.question}>
          <div className={major === '' ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your major?</div>
          <input
            className={major === '' ? styles.questionTodo : styles.questionName}
            type="text"
            placeholder="Computer Science"
            onChange={e => setMajor(e.target.value)}
          />
        </div>

        <div className={styles.question}>
          <div className={year === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your school year?</div>
          <input
            className={year === -1 ? styles.questionTodo : styles.questionName}
            type="number"
            placeholder="A number greater than 2020"
            onChange={e => handleSchoolYear(e.target.value)}
          />
        </div>

        <div className={styles.question}>
          <div className={degree === '' ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your degree?</div>
          <input
            className={
              degree === '' ? styles.questionTodo : styles.questionName
            }
            type="text"
            placeholder="Bachelor"
            onChange={e => setDegree(e.target.value)}
          />
        </div>

        <div className={styles.question}>
          <div className={gender === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your gender?</div>

          <div className={styles.toggle}>
            <input
              type="radio"
              name="g1"
              id="gender1"
              onChange={() => setGender(0)}
            />
            <label htmlFor="gender1">Male</label>
            <input
              type="radio"
              name="g1"
              id="gender2"
              onChange={() => setGender(1)}
            />
            <label htmlFor="gender2">Non-binary</label>
            <input
              type="radio"
              name="g1"
              id="gender3"
              onChange={() => setGender(2)}
            />
            <label htmlFor="gender3">Female</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={bedtime === '' ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Your bed time?</div>
          <input
            className={
              bedtime === '' ? styles.questionTodo : styles.questionName
            }
            type="time"
            defaultValue="22:00"
            onChange={e => setBedtime(e.target.value)}
          />
        </div>

        <div className={styles.question}>
          <div className={cook === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Do you cook?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g2"
              id="cook1"
              onChange={() => setCook(0)}
            />
            <label htmlFor="cook1">No</label>
            <input
              type="radio"
              name="g2"
              id="cook2"
              onChange={() => setCook(1)}
            />
            <label htmlFor="cook2">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={smoke === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Do you smoke?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g3"
              id="smoke1"
              onChange={() => setSmoke(0)}
            />
            <label htmlFor="smoke1">No</label>
            <input
              type="radio"
              name="g3"
              id="smoke2"
              onChange={() => setSmoke(1)}
            />
            <label htmlFor="smoke2">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={introvert === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Are you introvert?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g4"
              id="introvert1"
              onChange={() => setIntrovert(1)}
            />
            <label htmlFor="introvert1">No</label>
            <input
              type="radio"
              name="g4"
              id="introvert2"
              onChange={() => setIntrovert(2)}
            />
            <label htmlFor="introvert2">2</label>
            <input
              type="radio"
              name="g4"
              id="introvert3"
              onChange={() => setIntrovert(3)}
            />
            <label htmlFor="introvert3">3</label>
            <input
              type="radio"
              name="g4"
              id="introvert4"
              onChange={() => setIntrovert(4)}
            />
            <label htmlFor="introvert4">4</label>
            <input
              type="radio"
              name="g4"
              id="introvert5"
              onChange={() => setIntrovert(5)}
            />
            <label htmlFor="introvert5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={pets === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Do you plan to have pets?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g5"
              id="pet1"
              onChange={() => setPets(1)}
            />
            <label htmlFor="pet1">No</label>
            <input
              type="radio"
              name="g5"
              id="pet2"
              onChange={() => setPets(2)}
            />
            <label htmlFor="pet2">2</label>
            <input
              type="radio"
              name="g5"
              id="pet3"
              onChange={() => setPets(3)}
            />
            <label htmlFor="pet3">3</label>
            <input
              type="radio"
              name="g5"
              id="pet4"
              onChange={() => setPets(4)}
            />
            <label htmlFor="pet4">4</label>
            <input
              type="radio"
              name="g5"
              id="pet5"
              onChange={() => setPets(5)}
            />
            <label htmlFor="pet5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={clean === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Are you fairly clean?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g6"
              id="clean1"
              onChange={() => setClean(1)}
            />
            <label htmlFor="clean1">No</label>
            <input
              type="radio"
              name="g6"
              id="clean2"
              onChange={() => setClean(2)}
            />
            <label htmlFor="clean2">2</label>
            <input
              type="radio"
              name="g6"
              id="clean3"
              onChange={() => setClean(3)}
            />
            <label htmlFor="clean3">3</label>
            <input
              type="radio"
              name="g6"
              id="clean4"
              onChange={() => setClean(4)}
            />
            <label htmlFor="clean4">4</label>
            <input
              type="radio"
              name="g6"
              id="clean5"
              onChange={() => setClean(5)}
            />
            <label htmlFor="clean5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={music === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Do you play loud music?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g7"
              id="music1"
              onChange={() => setMusic(0)}
            />
            <label htmlFor="music1">No</label>
            <input
              type="radio"
              name="g7"
              id="music2"
              onChange={() => setMusic(1)}
            />
            <label htmlFor="music2">Yes</label>
          </div>
        </div>

        <div className={styles.sectionTag}>Matching Info</div>

        <div className={styles.question}>
          <div className={sameMajor === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Same major roommate?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g8"
              id="sameMajor1"
              onChange={() => setSameMajor(0)}
            />
            <label htmlFor="sameMajor1">No</label>
            <input
              type="radio"
              name="g8"
              id="sameMajor2"
              onChange={() => setSameMajor(1)}
            />
            <label htmlFor="sameMajor2">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={diffGender === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Same gender roommate?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g9"
              id="diffGender1"
              onChange={() => setDiffGender(0)}
            />
            <label htmlFor="diffGender1">No</label>
            <input
              type="radio"
              name="g9"
              id="diffGender2"
              onChange={() => setDiffGender(1)}
            />
            <label htmlFor="diffGender2">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={roommateSmoke === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Roommates smoke?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g10"
              id="roommateSmoke1"
              onChange={() => setRoommateSmoke(1)}
            />
            <label htmlFor="roommateSmoke1">No</label>
            <input
              type="radio"
              name="g10"
              id="roommateSmoke2"
              onChange={() => setRoommateSmoke(2)}
            />
            <label htmlFor="roommateSmoke2">2</label>
            <input
              type="radio"
              name="g10"
              id="roommateSmoke3"
              onChange={() => setRoommateSmoke(3)}
            />
            <label htmlFor="roommateSmoke3">3</label>
            <input
              type="radio"
              name="g10"
              id="roommateSmoke4"
              onChange={() => setRoommateSmoke(4)}
            />
            <label htmlFor="roommateSmoke4">4</label>
            <input
              type="radio"
              name="g10"
              id="roommateSmoke5"
              onChange={() => setRoommateSmoke(5)}
            />
            <label htmlFor="roommateSmoke5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={sleepSchedule === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Same sleeping schedule?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g11"
              id="sleepSchedule1"
              onChange={() => setSleepSchedule(1)}
            />
            <label htmlFor="sleepSchedule1">No</label>
            <input
              type="radio"
              name="g11"
              id="sleepSchedule2"
              onChange={() => setSleepSchedule(2)}
            />
            <label htmlFor="sleepSchedule2">2</label>
            <input
              type="radio"
              name="g11"
              id="sleepSchedule3"
              onChange={() => setSleepSchedule(3)}
            />
            <label htmlFor="sleepSchedule3">3</label>
            <input
              type="radio"
              name="g11"
              id="sleepSchedule4"
              onChange={() => setSleepSchedule(4)}
            />
            <label htmlFor="sleepSchedule4">4</label>
            <input
              type="radio"
              name="g11"
              id="sleepSchedule5"
              onChange={() => setSleepSchedule(5)}
            />
            <label htmlFor="sleepSchedule5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={eatTogether === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Eat together?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g12"
              id="eatTogether1"
              onChange={() => setEatTogether(1)}
            />
            <label htmlFor="eatTogether1">No</label>
            <input
              type="radio"
              name="g12"
              id="eatTogether2"
              onChange={() => setEatTogether(2)}
            />
            <label htmlFor="eatTogether2">2</label>
            <input
              type="radio"
              name="g12"
              id="eatTogether3"
              onChange={() => setEatTogether(3)}
            />
            <label htmlFor="eatTogether3">3</label>
            <input
              type="radio"
              name="g12"
              id="eatTogether4"
              onChange={() => setEatTogether(4)}
            />
            <label htmlFor="eatTogether4">4</label>
            <input
              type="radio"
              name="g12"
              id="eatTogether5"
              onChange={() => setEatTogether(5)}
            />
            <label htmlFor="eatTogether5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={outgoing === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Out going roommates?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g13"
              id="outgoing1"
              onChange={() => setOutgoing(0)}
            />
            <label htmlFor="outgoing1">No</label>
            <input
              type="radio"
              name="g13"
              id="outgoing2"
              onChange={() => setOutgoing(1)}
            />
            <label htmlFor="outgoing2">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={roommatePet === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Roommate have pets?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g14"
              id="roommatePet1"
              onChange={() => setRoommatePets(1)}
            />
            <label htmlFor="roommatePet1">No</label>
            <input
              type="radio"
              name="g14"
              id="roommatePet2"
              onChange={() => setRoommatePets(2)}
            />
            <label htmlFor="roommatePet2">2</label>
            <input
              type="radio"
              name="g14"
              id="roommatePet3"
              onChange={() => setRoommatePets(3)}
            />
            <label htmlFor="roommatePet3">3</label>
            <input
              type="radio"
              name="g14"
              id="roommatePet4"
              onChange={() => setRoommatePets(4)}
            />
            <label htmlFor="roommatePet4">4</label>
            <input
              type="radio"
              name="g14"
              id="roommatePet5"
              onChange={() => setRoommatePets(5)}
            />
            <label htmlFor="roommatePet5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={roommateClean === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Fairly clean roommate?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g15"
              id="roommateClean1"
              onChange={() => setRoommateClean(1)}
            />
            <label htmlFor="roommateClean1">No</label>
            <input
              type="radio"
              name="g15"
              id="roommateClean2"
              onChange={() => setRoommateClean(2)}
            />
            <label htmlFor="roommateClean2">2</label>
            <input
              type="radio"
              name="g15"
              id="roommateClean3"
              onChange={() => setRoommateClean(3)}
            />
            <label htmlFor="roommateClean3">3</label>
            <input
              type="radio"
              name="g15"
              id="roommateClean4"
              onChange={() => setRoommateClean(4)}
            />
            <label htmlFor="roommateClean4">4</label>
            <input
              type="radio"
              name="g15"
              id="roommateClean5"
              onChange={() => setRoommateClean(5)}
            />
            <label htmlFor="roommateClean5">Yes</label>
          </div>
        </div>

        <div className={styles.question}>
          <div className={roommateMusic === -1 ? styles.dot : styles.dotDone} />
          <div className={styles.questionName}>Roommate play loud music?</div>
          <div className={styles.toggle}>
            <input
              type="radio"
              name="g16"
              id="roommateMusic1"
              onChange={() => setRoommateMusic(0)}
            />
            <label htmlFor="roommateMusic1">No</label>
            <input
              type="radio"
              name="g16"
              id="roommateMusic2"
              onChange={() => setRoommateMusic(1)}
            />
            <label htmlFor="roommateMusic2">Yes</label>
          </div>
        </div>
      </div>
      <div className={styles.btnGroup}>
        {/*<div className={classNames(styles.btn, styles.saveBtn)}>Save</div>*/}
        <div
          className={classNames(styles.btn, styles.submitBtn)}
          onClick={event => submitInfos()}
        >
          Continue
        </div>
      </div>
    </div>
  )
}

export default Questions

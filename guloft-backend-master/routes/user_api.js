const express = require("express");
const User = require("../models/user");
const getUser = require('../middleware/getUser')
const router = new express.Router();
const auth = require('../middleware/auth')

// session
router.get('/auth/session', (req, res) => {
  try {
    console.log("auth session", req.session)
    res.send({ userId: req.session.userId, token: req.session.token })
  } catch (err) {
    res.send({
      status: 500,
      usersId: undefined,
      message: err,
    })
  }
})

// sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        console.log("user id is: ", user._id)
        req.session.userId = user._id
        req.session.token = token
        console.log("signuped: ", req.session)
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})

// login
router.post('/users/login', async (req, res) => {
    try {
        console.log('email', req.body.email)
        console.log('pwd', req.body.password)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log("hi")
        const token = await user.generateAuthToken()
        console.log("hi")
        req.session.userId = user._id
        req.session.token = token
        console.log(user._id)
        console.log(token)
        console.log("logined: ", req.session)
        res.send({ user, token })
    } catch (e) {
      console.log(e)
      res.status(400).send()
    }
})

// logout
router.post('/users/logout', async (req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter((token) => {
        //     return token.token !== req.token
        // })
        // await req.user.save()
        console.log("logging out")
        req.session.destroy();
        console.log(req.session)
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//logoutall
/***** [optional]
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
*/



/*
router.post("/users", async function (req, res) {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
  });
  const new_email = req.body.email;
  let old_user;
  try {
    old_user = await User.find({ email: new_email });
  } catch (err) {
    res.status(500).json({ message: err.message, data: {} });
  }
  if (old_user.length != 0) {
    res.status(500).json({ message: "duplicate email!", data: {} });
    return;
  }
  try {
    const newUser = await user.save();
    res.status(201).json({ message: "success", data: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message, data: {} });
  }
});
*/



router.get("/users/me", auth, (req, res) => {
  res.send(req.user.personal_info)
});



router.get("/p-info/me", auth, async (req, res) => {
    res.send(req.user.personal_info)
});



router.put("/p-info/me", auth, async (req, res) => {
  user_pesonal_info = req.user.personal_info;
  try {
    user_pesonal_info[req.body.question] = req.body.answer;
    const updatedUser = await req.user.set({
      personal_info: user_pesonal_info,
    });
    await updatedUser.save();
    res.status(200).json({ message: "success", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: {} });
  }
});


router.put("/p-info-all/me", auth, async (req, res) => {
    user_pesonal_info = req.user.personal_info;
    try {
        user_pesonal_info = req.body;
        const updatedUser = await req.user.set({
            personal_info: user_pesonal_info,
        });
        await updatedUser.save();
        res.status(200).json({ message: "success", data: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message, data: {} });
    }
});


router.get("/m-info/me", auth, async (req, res) => {
  res.status(200).json({ message: "success", data: req.user.matching_info });
});


router.put("/m-info-all/me", auth, async (req, res) => {
    user_matching_info = req.user.matching_info;
    try {
        user_matching_info = req.body;
        const updatedUser = await req.user.set({
            matching_info: user_matching_info,
        });
        await updatedUser.save();
        res.status(200).json({ message: "success", data: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message, data: {} });
    }
});

router.put("/m-info/me", auth, async (req, res) => {
  user_matching_info = req.user.matching_info;
  try {
    user_matching_info[req.body.question] = req.body.answer;
    const updatedUser = await req.user.set({
        matching_info: user_matching_info,
    });
    await updatedUser.save();
    res.status(200).json({ message: "success", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: {} });
  }
});


router.get('/user-c-info/:id', getUser, (req, res) => {
    user_pesonal_info = res.user.personal_info
    let card_info = {
            name: res.user.username,
            gender: user_pesonal_info.gender,
            college: user_pesonal_info.college,
            year: user_pesonal_info.year,
            email: res.user.email
            }
    res.status(200).json({message:"OK", data:card_info});
});


router.get("/user-favlist/me", auth, (req, res) => {
  res.status(200).json({ message: "OK", data: req.user.favourite_list });
});

router.get("/user-favlist/verify/:id", auth, (req, res) => {
    try {
        user_id = req.params.id
        user_fav_list = req.user.favourite_list;
        const tmp = user_fav_list.includes(user_id)
        res.status(200).json({ message: "OK", data: tmp });
    } catch(e) {
        return res.status(500).json({ message: err.message, data: {} });
    }
})

router.post("/user-favlist/me", auth, async (req, res) => {
  user_fav_list = req.user.favourite_list;
  if (user_fav_list.includes(req.body.userID)) {
    return res
      .status(500)
      .json({ message: "UserID already included in its fav list", data: {} });
  }
  if (req.body.userID == req.user._id) {
    return res
      .status(500)
      .json({ message: "Cannot add yourself to fav list", data: {} });
  }
  user_fav_list.push(req.body.userID);
  try {
    const updatedUser = await req.user.set({ favourite_list: user_fav_list });
    await updatedUser.save();
    res.status(200).json({ message: "success", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: {} });
  }
});



router.delete("/user-favlist/:id", auth, async (req, res) => {
  user_fav_list = req.user.favourite_list;
  user_id = req.params.id
  try {
    const idx = user_fav_list.indexOf(user_id);
    if (idx > -1) {
      user_fav_list.splice(idx, 1);
    } else {
      return res
        .status(500)
        .json({ message: "don't have this id in fav list", data: {} });
    }
    const updatedUser = await req.user.set({ favourite_list: user_fav_list });
    await updatedUser.save();
    res.status(200).json({ message: "success", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: {} });
  }
});

router.get("/matching-result/me", auth, async (req, res) => {
    try {
        const matching_info = req.user.matching_info;
        const personal_info = req.user.personal_info;
        let options = {where: {"personal_info.college": personal_info.college}};
        /*
        if (matching_info.major !== "false") {
            options.where["personal_info.major"] = personal_info.major;
        }*/
        if (matching_info.gender !== "false") {
            options.where["personal_info.gender"] = personal_info.gender;
        }
        let my_matching_info_parsed = [
            parseInt(matching_info.smoke),
            parseInt(matching_info.cook),
            matching_info.introverted === "true" ? 5 : 0,
            parseInt(matching_info.pets),
            parseInt(matching_info.clean),
            matching_info.introverted === "loud_sounds" ? 5 : 0
        ];

        User.find({}, null, options, function(err, users) {
            if (err) {
                res.status(500).json(response(err.message, {}));
            } else {
                /*
                const now = Date.now();
                const my_sleeping_start_hour = matching_info.sleeping_schedule.substring(0,2);
                const my_sleeping_start_min  = matching_info.sleeping_schedule.substring(3,5);
                const my_sleeping_end_hour   = matching_info.sleeping_schedule.substring(6,8);
                const my_sleeping_end_min    = matching_info.sleeping_schedule.substring(9,11);
                const between_day = parseInt(my_sleeping_end_hour) < parseInt(my_sleeping_start_hour)
                if (between_day) {
                    const my_sleeping_start = new Date(
                        now.getTime()
                        + my_sleeping_start_hour * 1000 * 60 * 60
                        + my_sleeping_start_min * 1000 * 60)
                    */
                let score_array = []
                let scores = []
                let user_ids = []
                users.forEach(user => {
                    /*
                    const user_sleeping_start_hour = user.matching_info.sleeping_schedule.substring(0,2);
                    const user_sleeping_start_min  = user.matching_info.sleeping_schedule.substring(3,5);
                    const user_sleeping_end_hour   = user.matching_info.sleeping_schedule.substring(6,8);
                    const user_sleeping_end_min    = user.matching_info.sleeping_schedule.substring(9,11);
                    */
                    let user_personal_info_parsed = [
                        user.personal_info.smoke === "true" ? 5 : 0,
                        user.personal_info.cook === "true" ? 5 : 0,
                        parseInt(user.personal_info.introverted),
                        parseInt(user.personal_info.pets),
                        parseInt(user.personal_info.clean),
                        user.personal_info.introverted === "loud_sounds" ? 5 : 0
                    ];
                    const dot_product = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
                    const score = dot_product(my_matching_info_parsed, user_personal_info_parsed)
                        / (dot_product(my_matching_info_parsed, my_matching_info_parsed)
                        * dot_product(user_personal_info_parsed, user_personal_info_parsed));
                    scores.push(score);
                    user_ids.push(user._id);
                })
                let max = Math.max(...scores);
                let min = Math.min(...scores);
                min -= 0.01//* (max-min)
                max += 0.01//* (max-min)
                const normalized_scores = scores.map(x => (x - min) / (max - min));
                user_ids.forEach((key, index) => {
                    const tmp = Math.round(normalized_scores[index] * 100)
                    score_array.push({roommateId:key, score: tmp})
                })
                shuffleArray(score_array)
                score_array = score_array.slice(0, 6)
                score_array = score_array.sort((a,b) => b.score - a.score)
                res.status(200).json({ message: "success", data: score_array });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: err.message, data: {} });
    }
})


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = router;

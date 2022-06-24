import { Taco } from "../models/taco.js"

function index(req, res) {
  Taco.find({})
  .then(tacos => {
    res.render('tacos/index', {
      title: '🌮',
      tacos
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/')
  })
}

function create(req, res) {
  req.body.owner = req.user.profile._id
  req.body.tasty = !!req.body.tasty
  Taco.create(req.body)
  .then(taco => {
    res.redirect('/tacos')
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

function show(req, res) {
  Taco.findById(req.params.id)
  .populate('owner')
  .then(taco => {
    res.render('tacos/show', {
      taco,
      title: '🌮 Show'
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

function flipTasty(req, res) {
  Taco.findById(req.params.id)
  .then(taco => {
    taco.tasty = !taco.tasty
    taco.save()
    .then(() => {
      res.redirect(`/tacos/${taco._id}`)
    })
    .catch(error => {
      console.log(error)
      res.redirect('/tacos')
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

function edit(req, res) {
  Taco.findById(req.params.id)
  .then(taco => {
    res.render('tacos/edit', {
      taco,
      title: 'Edit 🌮'
    })
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

function update(req, res) {
  Taco.findById(req.params.id)
  .then(taco => {
    if (taco.owner.equals(req.user.profile._id)) {
      req.body.tasty = !!req.body.tasty
      taco.updateOne(req.body, {new: true})
      .then(updatedTaco => {
        res.redirect(`/tacos/${taco._id}`)
      })
    } else {
      throw new Error ('NOT AUTHORIZED')
    }
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

function deleteTaco(req, res) {
  Taco.findById(req.params.id)
  .then(taco => {
    if (taco.owner.equals(req.user.profile._id)) {
      taco.delete()
      .then(() => {
        res.redirect('/tacos')
      })
    } else {
      throw new Error ('NOT AUTHORIZED')
    }
  })
  .catch(error => {
    console.log(error)
    res.redirect('/tacos')
  })
}

export {
  index,
  create,
  show,
  flipTasty,
  edit,
  update,
  deleteTaco as delete
}
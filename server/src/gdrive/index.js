import google from 'googleapis'
import fetch from 'node-fetch'
import {getUser} from '../auth/management'
import uuid from 'uuid/v4'
import fs from 'fs'
import sharp from 'sharp'
import rimraf from 'rimraf'

const {
  gdriveClientID,
  gdriveClientSecret,
  gdriveApiKey
} = process.env

const OAuth2 = google.auth.OAuth2

const gDirectory = 'application/vnd.google-apps.folder'

const auth = new OAuth2(
  gdriveClientID,
  gdriveClientSecret,
  "http://localhost:5000/gdrive"
)

const drive = google.drive({
  version: 'v3',
})


export default async function(req, res, next){
  try {

    const {
      body: {
        userId
      },
      file
    } = req

    // const drive = new G({
    //   userId
    // })
    //
    // await drive.getCredentials()
    //
    // const results = await drive.list({
    //   q: `mimeType='${drive.gDirectory}' and name='Knight Images' and appProperties has {key='knight' and value='true'}`,
    //   fields: 'files(id, name, appProperties, permissions)'
    // })
    //
    // console.log(results)

    const {identities} = await getUser(userId)

    const {access_token} = identities.find(
      identity => identity.provider === 'google-oauth2'
    )

    auth.setCredentials({
      access_token,
    })

    google.options({auth})




    let {files} = await driveSearch({
      q: `mimeType='${gDirectory}' and name='Knight Images' and appProperties has {key='knight' and value='true'}`,
      fields: 'files(id, name, appProperties, permissions)'
    })

    let knightDirectoryId


    if (files.length < 1) {
       let {id} = await driveCreate({
        resource: {
          name: 'Knight Images',
          mimeType: gDirectory,
          appProperties: {
            knight: true
          },
        },
      })

      await drivePermissions({
        resource: {
          type: 'anyone',
          role: 'reader'
        },
        fileId: id
      })

      knightDirectoryId = id

    } else {
      knightDirectoryId = files[0].id
    }

    const newImageId = uuid()

    const directory = `${__dirname}/${newImageId}`

    await mkdir(directory)

    await sharp(file.buffer).png().tile({size: 512, layout: 'zoomify'}).toFile(directory)

    await rename(`${directory}/TileGroup0`, `${directory}/tiles`)

    await sharp(file.buffer).toFile(`${directory}/original.${file.mimetype.split('/')[1]}`)

    await sharp(file.buffer).resize(200).toFile(`${directory}/s.png`)

    await sharp(file.buffer).resize(400).toFile(`${directory}/m.png`)


    const newImageGdriveId = await uploadDirectoryToDrive(directory,knightDirectoryId)

    const {files: newFiles} = await driveSearch({
      q: `name contains 'original' and '${newImageGdriveId}' in parents`,
      fields: 'files( webContentLink, webViewLink)'
    })


    await deleteDirectory(directory)

    res.send(newFiles[0])
  } catch (ex) {
    console.error(ex)
  }

}


async function driveSearch(options){
  return new Promise( (resolve, reject) => {
    drive.files.list(options, (err, response) => {
      if (err) reject(err)
      resolve(response)
    })
  })
}


async function driveCreate(options){
  return new Promise( (resolve, reject) => {
    drive.files.create(options, (err, response) => {
      if (err) reject(err)
      resolve(response)
    })
  })
}

async function drivePermissions(options){
  return new Promise( (resolve, reject) => {
    drive.permissions.create(options, (err, response) => {
      if (err) reject(err)
      resolve(response)
    })
  })
}

async function mkdir(path){
  return new Promise( (resolve, reject) => {
    fs.mkdir(path, () => resolve())
  })
}

async function rename(oldpath, newpath){
  return new Promise( (resolve, reject) => {
    fs.rename(oldpath, newpath, () => resolve())
  })
}

async function readdir(path){
  return new Promise( (resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

async function readFile(path){
  return new Promise( (resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

function deleteDirectory(path){
  return new Promise( (resolve, reject) => {
    rimraf(path, (err) => {
      if (err) console.log(err)
      resolve()
    })
  })
}

async function uploadDirectoryToDrive(path, rootParentId){
  try {

    let r = /\/([\w-]*$)/g

    let {id: parentId} = await driveCreate({
      resource: {
        name: r.exec(path)[1],
        mimeType: gDirectory,
        parents: [rootParentId]
      }
    })

    let files = []

    let items = await readdir(path)

    let toRead = items.map( file => ({
      name: file,
      path: `${path}/${file}`,
      parents: [parentId]
    }))


    while (toRead.length > 0) {

      let file = toRead.shift()

      let r = /\./g

      let isFile = r.test(file.name)


      if (
        isFile
      ) {

        files.push(file)

      } else {

        let {id} = await driveCreate({
          resource: {
            name: file.name,
            parents: file.parents,
            mimeType: gDirectory
          }
        })

        let items = await readdir(file.path)

        toRead = toRead.concat(items.map( item => ({
          name: item,
          path: `${file.path}/${item}`,
          parents: [id]
        })))

      }

    }

    while (files.length > 0) {

      let file = files.shift()

      let body = await readFile(file.path)

      await driveCreate({
        resource: {
          name: file.name,
          parents: file.parents,
        },
        media: {
          body
        }
      })

    }

    return parentId

  } catch (ex) {
    console.error(ex)
  }
}



//
//
// class G {
//
//   constructor({
//     userId
//   }) {
//     this.userId = userId
//
//     this.google = google
//
//     this.gDirectory = 'application/vnd.google-apps.folder'
//
//     this.auth = new this.google.auth.OAuth2(
//       gdriveClientID,
//       gdriveClientSecret,
//       "http://localhost:5000/gdrive"
//     )
//
//     this.drive = this.google.drive({
//       version: 'v3'
//     })
//
//   }
//
//   async getCredentials(){
//     try {
//       const {identities} = await getUser(this.userId)
//
//       const {access_token} = identities.find(
//         identity => identity.provider === 'google-oauth2'
//       )
//
//       this.auth.setCredentials({
//         access_token,
//       })
//
//       this.google.options({auth})
//
//     } catch (ex) {
//       console.error(ex)
//     }
//   }
//
//
//   async list(options) {
//     return new Promise( (resolve, reject) => {
//       this.drive.files.list(options, (err, response) => {
//         if (err) reject(err)
//         resolve(response)
//       })
//     })
//   }
//
// }

import { CONFIG } from '../../envVariables'
import { sha256 } from 'react-native-sha256'

export const createSciStarterAccount = async (
  username: string,
  email: string,
  password: string,
) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

  const urlencoded = new URLSearchParams()
  urlencoded.append('handle', username)
  urlencoded.append('email', email)
  urlencoded.append('password_cyphertext', password)
  urlencoded.append('project_id', CONFIG.PROJECT_SLUG)

  return fetch('https://scistarter.org/api/user/new?key=' + CONFIG.SCISTARTER_API_KEY, {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded.toString(),
    redirect: 'follow',
  })
    .then((response) => response.json())
    .then((result) => {
      console.log('createSciStarterAccount response ===', result)
      return result
    })
    .catch((error) => {
      console.log('Error creating SciStarter account:', error)
      return error
    })
}

export const recordParticipation = async (email: string) => {
  const projectSlug = CONFIG.PROJECT_SLUG
  try {
    const hashed = await sha256(email)
    console.log('hashed email ===', hashed)

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    const urlencoded = new URLSearchParams()
    urlencoded.append('hashed', hashed)
    // type: classifications | collection | signup
    urlencoded.append('type', 'classification')
    // seconds the user spent participating, or an estimate
    urlencoded.append('duration', '31')

    console.log('recordParticipation urlencoded ===', urlencoded)

    fetch(
      'https://scistarter.org/api/participation/hashed/' +
        projectSlug +
        '?key=' +
        CONFIG.SCISTARTER_API_KEY,
      {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded.toString(),
        redirect: 'follow',
      },
    )
      .then((response) => response.json())
      .then((result) => console.log('recordParticipation response ===', result))
      .catch((error) => console.log('Error recording participation response:', error))
  } catch (error) {
    console.log('Error recording participation catch:', error)
  }
}

import {getToken} from './getToken'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios'
import * as core from '@actions/core'
//Parametros la do core do action {organizationId, accountId}
//Parametros informados no commit através de t:{activityId} | tudo que estiver dentro do comentário irá para tarefa.

export async function createActivity(
  organizationId: number,
  accountId: number,
  folderId: number,
  title: string,
  description: string,
  // categoryText: string,
  estimatedEffort: number,
  creatorEmail: string,
  creatorPassword: string
) {
  const newToken = await getToken(creatorEmail, creatorPassword)
  const data = JSON.stringify({
    query: `mutation{
      createActivity(
        title: "${title}",
        accountId: ${accountId},  # OBRIGATÓRIO - ID do grupo de trabalho
        folderId: ${folderId}, # OBRIGATÓRIO - ID da pasta ou do projeto
        description: "${description}", 
        estimatedEffort: ${estimatedEffort},
        ) {
        id,
        folderTypeName,
        uid,
        communityId
        }
    }`,
    variables: {}
  })
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: 'https://app.artia.com/graphql',
    headers: {
      OrganizationId: organizationId.toString(),
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + newToken
    },
    data: data
  }
  axios(config)
    .then(function (response: AxiosResponse) {
      console.log(JSON.stringify(response.data))
      const resObj = response.data
      if (resObj.data != null) {
        console.log('Atividade criada com sucesso! ' + resObj.data)
      } else {
        core.setFailed(resObj.errors[0])
      }
    })
    .catch(function (error: AxiosError) {
      console.log(error.config)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
        return error.response
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
        return error.request
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
        return error.message
      }
    })
}

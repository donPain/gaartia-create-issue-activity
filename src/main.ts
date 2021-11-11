import * as core from '@actions/core'
import * as github from '@actions/github'

//Functions
import {createActivity} from './createActivity'

// // Get the JSON webhook payload for the event that triggered the workflow//
const payload = JSON.stringify(github.context.payload, undefined, 2)
const objPayload = JSON.parse(payload)
const organizationId = parseInt(core.getInput('organizationId')) //OrganizationId é o id da empresa/organização cadastrada no artia. (informado no main.yml do workflow)
const accountId = parseInt(core.getInput('accountId')) //AccountId é o id do grupo de trabalho. (informado no main.yml do workflow)
const creatorEmail = core.getInput('creatorEmail') //Email criador do comentário (informado no main.yml do workflow).
const creatorPassword = core.getInput('creatorPassword') //Password (Váriavel de ambiente{sescrets.ARTIA_PASSWORD} informada no main.yml do workflow).
const folderId = parseInt(core.getInput('folderId')) //Id da pasta ou do projeto.

async function run(): Promise<void> {
  try {
    const issue = objPayload.issue
    const description = issue.body
    // const categoryText = issue.labels.lenght > 0 ? issue.labels[0].name : ''
    const estimatedEffort = issue.title.split('[').pop().split(']')[0]
    const title = issue.title
      .replace('[', '')
      .replace(']', '')
      .replace(estimatedEffort, '')

    createActivity(
      organizationId,
      accountId,
      folderId,
      title,
      description,
      // categoryText,
      estimatedEffort,
      creatorEmail,
      creatorPassword
    )

    core.debug('Atividade criada com sucesso!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

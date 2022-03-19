import Application from '@ioc:Adonis/Core/Application'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadsController {
  public async show({ params, response }: HttpContextContract) {
    return response.download(Application.tmpPath('uploads', params.file))
  }
}

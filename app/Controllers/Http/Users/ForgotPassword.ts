import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/ForgotPassword'
import Database from '@ioc:Adonis/Lucid/Database'
import { User, UserKey } from 'App/Models'
import faker from 'faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordsController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)
      const user = new User()

      user.useTransaction(trx)

      const key = faker.datatype.uuid() + new Date().getTime()

      user.related('keys').create({ key })

      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      await Mail.send((message) => {
        message.to(email), message.from('Victorfjansen@outlook.com', 'Victor Jansen')
        message.subject('Atualização de Conta')
        message.htmlView('emails/recuperar', {
          link,
        })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    await user.merge({ password })

    await user.save()

    await userKey.delete()

    return user
  }
}

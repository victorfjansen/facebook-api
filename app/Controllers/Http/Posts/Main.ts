import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import { User, Post } from 'App/Models'
import fs from 'fs'

export default class PostsController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    const user = (await User.findBy('username', username)) || auth.user!

    await user.load('post', (q) => {
      q.orderBy('id', 'desc')
      q.preload('user', (q) => {
        q.select(['id', 'name', 'username'])
        q.preload('avatar')
      })
    })

    return user.post
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related('post').create(data)

    return post
  }

  public async update({ request, params, response, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.merge(data).save()

    return post
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.id) {
      return response.unauthorized()
    }

    await post.load('media')

    if (post.media) {
      fs.unlinkSync(Application.tmpPath('uploads', post.media.fileName))
      await post.media.delete()
    }
    await post.delete()
  }
}

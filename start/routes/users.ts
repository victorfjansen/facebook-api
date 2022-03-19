import Route from '@ioc:Adonis/Core/Route'

Route.post('/users/register', 'Users/Register.store')
Route.get('/users/register/:key', 'Users/Register.show')
Route.put('/users/register', 'Users/Register.update')

// Forgot Password

Route.post('/users/recovery_password', 'Users/ForgotPassword.store')
Route.get('/users/recovery_password/:key', 'Users/ForgotPassword.show')
Route.get('/users/recovery_password', 'Users/ForgotPassword.update')

Route.get('/users', 'Users/Main.show').middleware('auth')
Route.put('/users', 'Users/Main.update').middleware('auth')

Route.put('/users/avatar', 'User/Avatar.update').middleware('auth')
Route.delete('/users/avatar', 'User/Avatar.destroy').middleware('auth')

import mongoose, { Schema } from 'mongoose'

// schema input types
interface UserInputs {
  email: string
  password: string
  accessLevel: 'admin' | 'user'
}

// user document properties
interface UserDoc extends mongoose.Document {
  email: string
  password: string
  name: string
  username: string
  image: string
  signupAt: Date
  lastLogin: Date
  accessLevel: 'admin' | 'user'
  likes: Schema.Types.ObjectId
  recipes: Schema.Types.ObjectId
}

// adding new build method to schema type
interface UserModel extends mongoose.Model<UserDoc> {
  build: (inputs: UserInputs) => UserDoc
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  image: { type: String },
  signupAt: { type: Date },
  lastLogin: { type: Date },
  accessLevel: { type: String, enum: ['admin', 'author', 'vip', 'user'], required: true },
  likes: { type: [Schema.Types.ObjectId], ref: 'recipe' },
  recipes: { type: [Schema.Types.ObjectId], ref: 'recipe' }
})

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password
  }
})

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema)

export default User

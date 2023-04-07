import * as mongoose from 'mongoose';
export const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  age: String,
  email: String,
  password: String,
  verified: Boolean,
});
export class User extends mongoose.Document {
  constructor(
    public email: string,
    public password: string,
    public name?: string,
    public surname?: string,
    public age?: number,
    public verified?: boolean,
  ) {
    super();
  }
}

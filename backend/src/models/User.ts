import mongoose, {Schema, type Document} from "mongoose";

export interface IUser extends Document{
    clerkId: string;
    name:string;
    email:String;
    avatar:string;
    createdAt:Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique:true,
        lowercase: true,
    },
    avatar: {
        type: String,
        default: " ",
    },
},
{
     timestamps: true,
    }
)

export const User = mongoose.model("User", userSchema)
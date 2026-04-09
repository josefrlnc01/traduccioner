import mongoose, {Document, Schema} from 'mongoose'

export interface IStripeEvent extends Document  {
    eventId: string
}

const stripeEventsSchema: Schema = new Schema({
    eventId: {
        type: String
    }
})

const StripeEvent = mongoose.model<IStripeEvent>('StripeEvent', stripeEventsSchema)

export default StripeEvent
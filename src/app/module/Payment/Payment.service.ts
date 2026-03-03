import stripe from "stripe"
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../../prisma/generated/prisma";


const handlestripe =async (event: stripe.Event) => {
    const existingPayment = await prisma.payment.findUnique({
        where: {
          stripeEventId: event.id,
        },
    });
    if (existingPayment) {
        console.log(`Event ${event.id}  already Processed skiPing`)
        return {message : `Event ${event.id}  already Processed skiPing`}
    }
    switch (event.type) {
        case "checkout.session.completed":{ 
            const session = event.data.object 
            const appointmentId = session.metadata?.appointmentId
            const PaymnentId = session.metadata?.paymentId
            if(!appointmentId || !PaymnentId){
                console.log("Missing appointmentId or paymentId in session metadata")
                return {message : "Missing appointmentId or paymentId in session metadata"}
            }
            const appointment = await prisma.appointment.findUnique({
                where: {
                    id: appointmentId,
                },
            });
            if (!appointment) {
                console.log(`Appointment with id ${appointmentId} not found`)
                return {message : `Appointment with id ${appointmentId} not found`}
            }
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: {
                        id: PaymnentId,
                    },
                    data: {
                        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        stripeEventId: event.id,
                    },
                })
                await tx.appointment.update({
                    where: {
                        id: appointmentId,
                    },
                    data: {
                        paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    },
                })

            })
            console.log(`Payment processed for event ${event.id}, appointment ${appointmentId}, payment ${PaymnentId}`)
            break;

        }
            case"checkout.session.expired":{
                const session = event.data.object
                console.log(`Session expired: ${session.id}`)
                break;
            }
            case "payment_intent.succeeded":{
                const session = event.data.object 
                console.log(`Payment succeeded: ${session.id}`)
                break;
            }
            case "payment_intent.payment_failed":{
                const session = event.data.object
                console.log(`Payment failed: ${session.id}`)
                break;
            }
                default:
                    console.log(`Unhandled event type ${event.type}`)
    }
    return {message : `Event ${event.id} processed successfully`}

}
export const PaymentService = {
    handlestripe
}
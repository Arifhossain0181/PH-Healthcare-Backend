import { PaymentStatus, Role } from "../../../../prisma/generated/prisma";
import { IRequest } from "../../interface/request.interface";
import { prisma } from "../../lib/prisma";

const getdashboardstats = async (user: IRequest) => {
  let statsdata;
  switch (user.role) {
    case Role.SUPER_ADMIN:
      statsdata = await getSuperAdminStats();
      break;
    case Role.ADMIN:
      statsdata = await getAdminStats();
      break;
    case Role.DOCTOR:
      statsdata = await getDoctorStats(user);
      break;
    case Role.PATIENT:
      statsdata = await getPatientStats(user);
      break;
    default:
      throw new Error("Invalid user role");
  }
  return statsdata;
};

const getSuperAdminStats = async () => {
  const appointmentsCount = await prisma.appointment.count();
  const doctorsCount = await prisma.doctor.count();
  const patientsCount = await prisma.patient.count();
  const adminsCount = await prisma.user.count({ where: { role: Role.ADMIN } });
  const superAdminsCount = await prisma.user.count({
    where: { role: Role.SUPER_ADMIN },
  });
  const PaymentsCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const Paicahrtdata = await getPiechatdata();
  const Varchartdata = await getvarchartdata();
  return {
    appointmentsCount,
    doctorsCount,
    patientsCount,
    adminsCount,
    superAdminsCount,
    PaymentsCount,
    userCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    Paicahrtdata,
    Varchartdata
  };

};

const getAdminStats = async () => {
  const appointmentsCount = await prisma.appointment.count();
  const doctorsCount = await prisma.doctor.count();
  const patientsCount = await prisma.patient.count();

  const PaymentsCount = await prisma.payment.count();
  const userCount = await prisma.user.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const Paicahrtdata = await getPiechatdata();
  const Varchartdata = await getvarchartdata();


  return {
    appointmentsCount,
    doctorsCount,
    patientsCount,
    PaymentsCount,
    userCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    Paicahrtdata,
    Varchartdata
  };
};
const getDoctorStats = async (user: IRequest) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            email: user.email
        },
        include:{
            appointments: true  
            ,
            reviews: true,
            user: true
        }
    })
    const reviewsCount = await prisma.review.count({
        where: {
            doctorId: doctor?.id
        }    })
   
    const Patientcount = await prisma.appointment.groupBy({
        by: ["patientId"],
        _count:{
            id: true
        },
        where: {
            doctorId: doctor?.id}
    })
  const appointmentsCount = await prisma.appointment.count({
    where: {
        doctorId: doctor?.id}
    });
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        }
        ,where: {
            appointment: {
                doctorId: doctor?.id
            },
            status: PaymentStatus.PAID}
        });


        const aPPointmentStastusDitrubution = await prisma.appointment.groupBy({
            by:["status"],
            _count: {
                id: true
            },
            where:{
                doctorId: doctor?.id
            }
        })
        const formattedStatusDistribution = aPPointmentStastusDitrubution.map(item =>({
            status: item.status,
            count: item._count.id

        }))
    return {
        appointmentsCount,
        reviewsCount,
        Patientcount: Patientcount.length,
        totalRevenue: totalRevenue._sum.amount || 0,
        appointmentStatusDistribution: formattedStatusDistribution
    };
}
const getPatientStats = async (user: IRequest) => {
    const patient = await prisma.patient.findUnique({
        where: {
            email: user.email
        },
    })
    const appointmentsCount = await prisma.appointment.count({
        where: {
            patientId: patient?.id
        }
    });
    const doctorsCount = await prisma.appointment.count({
        where: {
            patientId: patient?.id
        }
    });
    const reviewsCount = await prisma.review.count({
        where: {
            patientId: patient?.id
        }
    })
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        }
        ,where: {
            appointment: {
                patientId: patient?.id
            },
            status: PaymentStatus.PAID}
        });
        const appointmentStatusDistribution = await prisma.appointment.groupBy({
            by:["status"],
            _count: {
                id: true
            },
            where:{
                patientId: patient?.id
            }
        })
        const formattedStatusDistribution = appointmentStatusDistribution.map(item =>({
            status: item.status,
            count: item._count.id

        }))
    return {
        appointmentsCount,
        doctorsCount,
        reviewsCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        appointmentStatusDistribution: formattedStatusDistribution
    };
}

const getPiechatdata = async () => {
    const aPPointmentstatusDistribution = await prisma.appointment.groupBy({
        by:["status"],
        _count: {
            id: true
        }
    })
    const formattedStatusDistribution = aPPointmentstatusDistribution.map(item =>({
        status: item.status,
        count: item._count.id
    }))
    return formattedStatusDistribution;
}
const getvarchartdata = async () => {
    interface APPointmentCOuntByMonth {
        month: Date;
      
        count: bigint;
    }
    const appointmentsByMonth : APPointmentCOuntByMonth[] = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month, CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month;
        
    `;
    return appointmentsByMonth

}



export const StatsService = {
    getdashboardstats,
    getDoctorStats,
    getAdminStats,
    getSuperAdminStats,
    getPatientStats,
    getPiechatdata,
    getvarchartdata
}


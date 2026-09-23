import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { toLocalParts, toScheduledAt } from '../src/config/slots.js';

const prisma = new PrismaClient();

function dayFromToday(days) {
  return toLocalParts(new Date(Date.now() + days * 86_400_000)).date;
}

async function seedAdmin() {
  if ((await prisma.admin.count()) > 0) return;

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await prisma.admin.create({ data: { password } });
}

async function seedBarbers() {
  if ((await prisma.barber.count()) > 0) return;

  await prisma.barber.createMany({
    data: [
      { name: 'Carlos Santos', specialty: 'Cortes Clássicos', rating: 4.8, experience: '8 anos', tags: 'Degradê, Barba, Navalha' },
      { name: 'Rafael Lima', specialty: 'Barba', rating: 4.6, experience: '5 anos', tags: 'Barba, Toalha Quente' },
      { name: 'Bruno Costa', specialty: 'Cortes Modernos', rating: 4.9, experience: '3 anos', tags: 'Degradê, Freestyle' },
      { name: 'Diego Alves', specialty: 'Pigmentação', rating: 4.5, experience: '6 anos', tags: 'Pigmentação', isActive: false },
    ],
  });
}

async function seedServices() {
  if ((await prisma.barberService.count()) > 0) return;

  await prisma.barberService.createMany({
    data: [
      { name: 'Corte Tradicional', description: 'Corte clássico com máquina e tesoura', price: 50, durationMinutes: 30, icon: 'scissors' },
      { name: 'Barba', description: 'Barba com toalha quente e navalha', price: 35, durationMinutes: 30, icon: 'razor' },
      { name: 'Corte + Barba', description: 'Combo de corte e barba', price: 80, durationMinutes: 30, icon: 'combo' },
      { name: 'Pigmentação', description: 'Pigmentação de barba ou cabelo', price: 60, durationMinutes: 30, icon: 'brush' },
      { name: 'Relaxamento', description: 'Relaxamento capilar', price: 70, durationMinutes: 30, icon: 'drop', isActive: false },
    ],
  });
}

async function seedCustomers() {
  const customers = [
    { name: 'João Silva', phone: '11987654321' },
    { name: 'Maria Souza', phone: '11912345678' },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: {},
      create: customer,
    });
  }
}

async function seedAppointments() {
  if ((await prisma.appointment.count()) > 0) return;

  const customer = await prisma.customer.findUnique({ where: { phone: '11987654321' } });
  const barbers = await prisma.barber.findMany();
  const services = await prisma.barberService.findMany();
  const barber = (name) => barbers.find((item) => item.name === name);
  const service = (name) => services.find((item) => item.name === name);

  const appointments = [
    { days: -7, slot: '10:00', barber: barber('Rafael Lima'), service: service('Corte Tradicional'), status: 'COMPLETED' },
    { days: -3, slot: '14:00', barber: barber('Rafael Lima'), service: service('Barba'), status: 'CANCELED' },
    { days: 1, slot: '09:00', barber: barber('Carlos Santos'), service: service('Corte Tradicional'), status: 'PENDING' },
    { days: 1, slot: '10:00', barber: barber('Carlos Santos'), service: service('Barba'), status: 'CONFIRMED' },
  ];

  await prisma.appointment.createMany({
    data: appointments.map(({ days, slot, barber: { id: barberId }, service: { id: barberServiceId, price }, status }) => ({
      customerId: customer.id,
      barberId,
      barberServiceId,
      scheduledAt: toScheduledAt(dayFromToday(days), slot),
      price,
      status,
    })),
  });
}

async function main() {
  await seedAdmin();
  await seedBarbers();
  await seedServices();
  await seedCustomers();
  await seedAppointments();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

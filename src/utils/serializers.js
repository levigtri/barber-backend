export const appointmentInclude = {
  customer: true,
  barber: true,
  barberService: true,
};

export function serializeBarberService(service) {
  return service && { ...service, price: Number(service.price) };
}

export function serializeAppointment(appointment) {
  return {
    ...appointment,
    price: Number(appointment.price),
    ...(appointment.barberService && {
      barberService: serializeBarberService(appointment.barberService),
    }),
  };
}

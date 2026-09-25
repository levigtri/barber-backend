import { prisma } from '../config/prisma.js';
import { serializeBarberService } from '../utils/serializers.js';

export const barberServiceController = {
  async list(req, res, next) {
    try {
      const services = await prisma.barberService.findMany({
        where: req.query.activeOnly ? { isActive: true } : {},
        orderBy: { name: 'asc' },
      });

      return res.json(services.map(serializeBarberService));
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const service = await prisma.barberService.findUnique({ where: { id: req.params.id } });

      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }

      return res.json(serializeBarberService(service));
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const service = await prisma.barberService.create({ data: req.body });

      return res.status(201).json(serializeBarberService(service));
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const existingService = await prisma.barberService.findUnique({ where: { id: req.params.id } });

      if (!existingService) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }

      const service = await prisma.barberService.update({
        where: { id: req.params.id },
        data: req.body,
      });

      return res.json(serializeBarberService(service));
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const existingService = await prisma.barberService.findUnique({ where: { id: req.params.id } });

      if (!existingService) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }

      await prisma.barberService.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};

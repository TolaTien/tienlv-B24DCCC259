import { Request, Response } from 'express';

const destinations = [
  {
    id: '1',
    name: 'Vịnh Hạ Long',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    location: 'Quảng Ninh, Việt Nam',
    rating: 5,
    type: 'beach',
    description: 'Di sản thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ.',
    visitTime: 48,
    costFood: 1500000,
    costStay: 2000000,
    costTravel: 500000,
    price: 4000000,
  },
  {
    id: '2',
    name: 'Sapa - Fansipan',
    image: 'https://images.unsplash.com/photo-1509030464150-144362bc6503?auto=format&fit=crop&w=800&q=80',
    location: 'Lào Cai, Việt Nam',
    rating: 4.8,
    type: 'mountain',
    description: 'Thị trấn trong sương với đỉnh Fansipan - nóc nhà Đông Dương.',
    visitTime: 72,
    costFood: 1000000,
    costStay: 1500000,
    costTravel: 800000,
    price: 3300000,
  },
  {
    id: '3',
    name: 'Phố Cổ Hội An',
    image: 'https://images.unsplash.com/photo-1555505019-8c3f4c19e309?auto=format&fit=crop&w=800&q=80',
    location: 'Quảng Nam, Việt Nam',
    rating: 4.7,
    type: 'city',
    description: 'Thương cảng cổ kính với đèn lồng rực rỡ và kiến trúc đặc trưng.',
    visitTime: 24,
    costFood: 800000,
    costStay: 1200000,
    costTravel: 400000,
    price: 2400000,
  },
  {
    id: '4',
    name: 'Đảo Phú Quốc',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    location: 'Kiên Giang, Việt Nam',
    rating: 4.9,
    type: 'beach',
    description: 'Đảo Ngọc với bãi biển cát trắng mịn và nước trong xanh.',
    visitTime: 96,
    costFood: 3000000,
    costStay: 5000000,
    costTravel: 2000000,
    price: 10000000,
  },
  {
    id: '5',
    name: 'Đà Lạt - Thành phố ngàn hoa',
    image: 'https://images.unsplash.com/photo-1621213271714-469614f17478?auto=format&fit=crop&w=800&q=80',
    location: 'Lâm Đồng, Việt Nam',
    rating: 4.6,
    type: 'mountain',
    description: 'Khí hậu ôn đới quanh năm, thành phố của tình yêu và ngàn hoa.',
    visitTime: 48,
    costFood: 1200000,
    costStay: 1800000,
    costTravel: 600000,
    price: 3600000,
  },
  {
    id: '6',
    name: 'TP. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    location: 'Sài Gòn, Việt Nam',
    rating: 4.5,
    type: 'city',
    description: 'Trung tâm kinh tế sầm uất nhất Việt Nam với nhịp sống năng động.',
    visitTime: 24,
    costFood: 1000000,
    costStay: 1500000,
    costTravel: 300000,
    price: 2800000,
  }
];

export default {
  'GET /api/travel/destinations': (req: Request, res: Response) => {
    res.send({ data: destinations, success: true });
  },
  'POST /api/travel/destinations': (req: Request, res: Response) => {
    const newItem = { ...req.body, id: Date.now().toString() };
    destinations.push(newItem);
    res.send({ data: newItem, success: true });
  },
  'PUT /api/travel/destinations/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = destinations.findIndex(item => item.id === id);
    if (index > -1) {
      destinations[index] = { ...destinations[index], ...req.body };
      res.send({ data: destinations[index], success: true });
    } else {
      res.status(404).send({ message: 'Not found', success: false });
    }
  },
  'DELETE /api/travel/destinations/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = destinations.findIndex(item => item.id === id);
    if (index > -1) {
      destinations.splice(index, 1);
      res.send({ success: true });
    } else {
      res.status(404).send({ message: 'Not found', success: false });
    }
  },
  'GET /api/travel/itineraries': (req: Request, res: Response) => {
    res.send({ data: [], success: true });
  },
};

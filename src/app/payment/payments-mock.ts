type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const PAYMENT_MOCK: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com'
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com'
  },
  {
    id: 'a1b2c3d4',
    amount: 200,
    status: 'success',
    email: 'user1@example.com'
  },
  {
    id: 'b2c3d4e5',
    amount: 150,
    status: 'failed',
    email: 'user2@example.com'
  },
  {
    id: 'c3d4e5f6',
    amount: 300,
    status: 'pending',
    email: 'user3@example.com'
  },
  {
    id: 'd4e5f6g7',
    amount: 250,
    status: 'processing',
    email: 'user4@example.com'
  },
  {
    id: 'e5f6g7h8',
    amount: 400,
    status: 'success',
    email: 'user5@example.com'
  },
  {
    id: 'f6g7h8i9',
    amount: 350,
    status: 'failed',
    email: 'user6@example.com'
  },
  {
    id: 'g7h8i9j0',
    amount: 500,
    status: 'pending',
    email: 'user7@example.com'
  },
  {
    id: 'h8i9j0k1',
    amount: 450,
    status: 'processing',
    email: 'user8@example.com'
  },
  {
    id: 'i9j0k1l2',
    amount: 600,
    status: 'success',
    email: 'user9@example.com'
  },
  {
    id: 'j0k1l2m3',
    amount: 550,
    status: 'failed',
    email: 'user10@example.com'
  }
]

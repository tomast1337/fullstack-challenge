import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import
import { ProductCard } from './ProductCard';
import { ProductDto } from '@backend/product/dto/product.dto';
import { useRouter } from 'next/router';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockProduct: ProductDto = {
  id: 1,
  name: 'Test Product',
  description: 'This is a test product',
  picture: 'https://via.placeholder.com/300',
  price: 99.99,
  stockQuantity: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('<ProductCard>', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<ProductCard product={mockProduct} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

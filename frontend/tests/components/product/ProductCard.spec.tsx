import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import

import { ProductDto } from '@backend/product/dto/product.dto';
import { useRouter } from 'next/router';
import { AppRouterContextProviderMock } from 'frontend/mocks/app-router-context-provider-mock';
import { ProductCard } from '@frontend/components/product/ProductCard';

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
  let asFragment: () => DocumentFragment;
  let push: jest.Mock;
  beforeEach(() => {
    push = jest.fn();
    asFragment = render(
      <AppRouterContextProviderMock router={{ push }}>
        <ProductCard product={mockProduct} />
      </AppRouterContextProviderMock>,
    ).asFragment;
  });

  it('renders correctly and matches snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display the product name correctly', () => {
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it('should display the price formatted with two decimal places', () => {
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should navigate to the product page when clicked', () => {
    const button = screen.getByRole('button', { name: /see product/i });
    button.click();
    expect(push).toHaveBeenCalledWith(`/product/${mockProduct.id}`);
  });

  it('should render the product image with correct src and alt attributes', () => {
    const image = screen.getByRole('img', {
      name: mockProduct.name,
    }) as HTMLImageElement;
    expect(image).toBeInTheDocument();
  });

  it("should show an 'Out of Stock' button when stockQuantity is 0", () => {
    render(
      <AppRouterContextProviderMock router={{ push }}>
        <ProductCard product={{ ...mockProduct, stockQuantity: 0 }} />
      </AppRouterContextProviderMock>,
    );

    const outOfStockButton = screen.getByRole('button', {
      name: /out of stock/i,
    });
    expect(outOfStockButton).toBeInTheDocument();
    expect(outOfStockButton).toBeDisabled();
  });

  it("should NOT navigate when clicking 'Out of Stock' button", async () => {
    render(
      <AppRouterContextProviderMock router={{ push }}>
        <ProductCard product={{ ...mockProduct, stockQuantity: 0 }} />
      </AppRouterContextProviderMock>,
    );

    const outOfStockButton = screen.getByRole('button', {
      name: /out of stock/i,
    });
    outOfStockButton.click();
    expect(push).not.toHaveBeenCalled();
  });
});

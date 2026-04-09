import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('renders brand name and navigation links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check if the brand name "RentWheels" is rendered
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Wheels')).toBeInTheDocument();

    // Check if basic navigation is present
    expect(screen.getByText('Каталог транспорта')).toBeInTheDocument();
    expect(screen.getByText('О нас')).toBeInTheDocument();
    expect(screen.getByText('Контакты')).toBeInTheDocument();

    // Check copyright text
    expect(screen.getByText(/Все права защищены/)).toBeInTheDocument();
  });
});

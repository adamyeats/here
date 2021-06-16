import { render } from '@testing-library/react';
import App from './App';

test('renders', () => {
  const app = render(<App />);
  expect(app).toBeInTheDocument();
});

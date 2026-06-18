import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

async function errorsFor(payload: Partial<RegisterDto>) {
  const dto = plainToInstance(RegisterDto, payload);
  return validate(dto);
}

describe('RegisterDto validation', () => {
  const validBase = {
    name: 'A Reasonably Long Full Name', // 27 chars
    email: 'someone@example.com',
    address: '221B Baker Street, London',
    password: 'Str0ng!Pass',
  };

  it('accepts a fully valid payload', async () => {
    const errors = await errorsFor(validBase);
    expect(errors.length).toBe(0);
  });

  it('rejects a name shorter than 20 characters', async () => {
    const errors = await errorsFor({ ...validBase, name: 'Short Name' });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects a name longer than 60 characters', async () => {
    const errors = await errorsFor({ ...validBase, name: 'N'.repeat(61) });
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const errors = await errorsFor({ ...validBase, email: 'not-an-email' });
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejects an address over 400 characters', async () => {
    const errors = await errorsFor({ ...validBase, address: 'A'.repeat(401) });
    expect(errors.some((e) => e.property === 'address')).toBe(true);
  });

  it('rejects a password with no uppercase letter', async () => {
    const errors = await errorsFor({ ...validBase, password: 'str0ng!pass' });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects a password with no special character', async () => {
    const errors = await errorsFor({ ...validBase, password: 'Str0ngPass' });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects a password outside the 8-16 length range', async () => {
    const errors = await errorsFor({ ...validBase, password: 'S1!' });
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });
});

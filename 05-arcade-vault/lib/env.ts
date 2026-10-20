import 'server-only';

function required(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing env var: ${name}`);
  }
  return val;
}

export const env = {
  get RESEND_API_KEY(): string {
    return required('RESEND_API_KEY');
  },
  get CONTACT_TO_EMAIL(): string {
    return required('CONTACT_TO_EMAIL');
  },
  get CONTACT_FROM_EMAIL(): string {
    return required('CONTACT_FROM_EMAIL');
  },
};

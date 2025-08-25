import { z } from 'zod';

export const detailsStepSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(60, 'First name must be 60 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(60, 'Last name must be 60 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().optional(),
  state: z.string().length(2, 'Please select a state'),
  zip: z.string().min(3, 'ZIP code must be at least 3 characters').max(10, 'ZIP code must be 10 characters or less'),
  comment: z.string().max(500, 'Comment must be 500 characters or less').optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to sign the petition'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const signatureSchema = z.object({
  method: z.enum(['drawn', 'typed']),
  signatureImageBase64: z.string().optional(),
  typedSignature: z.string().optional(),
}).refine(data => {
  if (data.method === 'drawn' && !data.signatureImageBase64) {
    return false;
  }
  if (data.method === 'typed' && !data.typedSignature) {
    return false;
  }
  return true;
}, 'Please provide a signature');

export type DetailsStepForm = z.infer<typeof detailsStepSchema>;
export type OtpForm = z.infer<typeof otpSchema>;
export type SignatureForm = z.infer<typeof signatureSchema>;

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];
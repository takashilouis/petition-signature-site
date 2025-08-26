import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../../../../../lib/adminAuth';
import { listSignatures } from '../../../../../core/repos/signatureRepo';

function escapeCSVField(field: string | null | undefined): string {
  if (!field) return '';
  
  // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
  const escaped = field.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
    return `"${escaped}"`;
  }
  return escaped;
}

export async function GET(request: NextRequest) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        city: searchParams.get('city') || undefined,
        state: searchParams.get('state') || undefined,
        country: searchParams.get('country') || undefined,
        from: searchParams.get('from') || undefined,
        to: searchParams.get('to') || undefined,
        q: searchParams.get('q') || undefined,
        page: 1,
        size: 10000, // Large number to get all results
      };
      
      const { items } = await listSignatures(filters);
      
      // CSV headers
      const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'City',
        'State',
        'ZIP',
        'Country',
        'Comment',
        'Method',
        'Signed At',
        'IP Address',
        'Audit Hash'
      ];
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      for (const item of items) {
        const row = [
          escapeCSVField(item.id),
          escapeCSVField(item.firstName),
          escapeCSVField(item.lastName),
          escapeCSVField(item.email),
          escapeCSVField(item.city),
          escapeCSVField(item.state),
          escapeCSVField(item.zip),
          escapeCSVField(item.country),
          escapeCSVField(item.comment),
          escapeCSVField(item.method),
          escapeCSVField(item.createdAt.toISOString()),
          escapeCSVField(item.ip),
          escapeCSVField(item.auditHash),
        ];
        csvContent += row.join(',') + '\n';
      }
      
      // Return CSV as downloadable file
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="signatures-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } catch (error) {
      console.error('Admin CSV export error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

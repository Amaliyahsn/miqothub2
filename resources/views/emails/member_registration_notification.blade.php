<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pendaftaran Berhasil</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; background-color: #ffffff; margin: 0; padding: 40px 20px;">
    
    <div style="max-width: 560px; margin: 0 auto; padding: 24px 0; border-top: 2px solid #0f172a;">
        
        <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 32px;">
            MiqotHub
        </div>

        <p style="font-size: 14px; margin-top: 0; margin-bottom: 16px;">Halo {{ $data['nama_member'] }},</p>
        
        <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
            Pendaftaran Anda pada platform MiqotHub telah berhasil kami terima. Transaksi melalui Midtrans telah diverifikasi secara otomatis oleh sistem, dan saat ini akun Anda sedang dalam proses peninjauan oleh administrator untuk aktivasi.
        </p>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; font-size: 14px; border-collapse: collapse;">
            <tr>
                <td style="width: 140px; padding: 8px 0; color: #64748b; vertical-align: top;">Kelas</td>
                <td style="padding: 8px 0; font-weight: 600; color: #0f172a; vertical-align: top;">{{ $data['nama_kelas'] }}</td>
            </tr>
            <tr>
                <td style="width: 140px; padding: 8px 0; color: #64748b; vertical-align: top;">Metode Pembayaran</td>
                <td style="padding: 8px 0; color: #0f172a; vertical-align: top;">{{ $data['metode_pembayaran'] }}</td>
            </tr>
            <tr>
                <td style="width: 140px; padding: 8px 0; color: #64748b; vertical-align: top;">Status Akun</td>
                <td style="padding: 8px 0; color: #b45309; font-weight: 600; vertical-align: top;">Menunggu Aktivasi</td>
            </tr>
        </table>

        <div style="border-top: 1px dashed #e2e8f0; padding-top: 16px; margin-bottom: 40px;">
            <p style="font-size: 13px; color: #475569; margin: 0;">
                <strong>Catatan:</strong> Proses aktivasi manual memerlukan waktu 1 hingga 2 hari kerja. Apabila akun Anda belum aktif dalam waktu lebih dari 3 hari kerja, silakan hubungi layanan bantuan administrator melalui WhatsApp untuk konfirmasi manual.
            </p>
        </div>

        <p style="font-size: 11px; color: #94a3b8; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            Email ini dikirimkan secara otomatis oleh sistem MiqotHub dan tidak memerlukan balasan.
        </p>
        
    </div>

</body>
</html>
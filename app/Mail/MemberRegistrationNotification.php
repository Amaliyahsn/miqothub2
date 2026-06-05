<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MemberRegistrationNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pendaftaran MiqotHub Berhasil - Menunggu Aktivasi',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.member_registration_notification', // Menunjuk ke file blade html
        );
    }
}
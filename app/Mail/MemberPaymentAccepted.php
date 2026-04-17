<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MemberPaymentAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $member;
    public $course;

    public function __construct($member, $course)
    {
        $this->member = $member;
        $this->course = $course;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pembayaran Diterima! Selamat Belajar di MiqotHub',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.member.accepted',
        );
    }
}
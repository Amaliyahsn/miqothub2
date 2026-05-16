<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1">
        <link rel="alternate icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.svg">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <script type="text/javascript" 
                src="https://app.sandbox.midtrans.com/snap/snap.js" 
                data-client-key="{{ config('services.midtrans.client_key') ?? env('MIDTRANS_CLIENT_KEY') }}">
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/index.jsx'])

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <!-- For apple devices -->
    <link rel="apple-touch-icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <title>{{ env('APP_TITLE') }}</title>
</head>

<body>
    <div id="app"></div>
</body>

</html>

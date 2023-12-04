@extends('layouts.mail')
@section('title', 'Hello!')
@section('content')
    <table width="660" border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" class="full-width">
        <tbody>
            <tr>
                <td align="center" valign="top"
                    style="font-family:helvetica,arial,sans-serif;color:#646464; font-size:16px; line-height:22px;padding-left:20px; padding-right:20px"
                    class="body">
                    We sent this email because we received a password reset request. If you didn't submit the request,
                    please ignore this email and contact us as soon as possible.
                </td>
            </tr>
        </tbody>
    </table>
    <table width="660" border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" class="full-width">
        <tbody>
            <tr>
                <td>
                    <div style="font-size:20px;line-height:20px;">&nbsp;</div>
                </td>
            </tr>
        </tbody>
    </table>

    <table width="660" border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" class="full-width">
        <tbody>

            <tr>
                <td align="center" width="600" class="full-width" style="padding-left: 20px; padding-right:20px"
                    valign="top">
                    <a class="zoom" id="activate" target="_blank"
                        href="{{ $url }}">Reset Password</a>
                </td>
            </tr>
        </tbody>
    </table>

    <table width="660" border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" class="full-width">

        <tbody>
            <tr>
                <td>
                    <div style="font-size:20px;line-height:19px;">&nbsp;</div>
                </td>
            </tr>
            <tr>
                <td width="660">
                    <div style="border-bottom: 1px solid #e0e0e0; width: 660px; height:2px;" class="full-width"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div style="font-size:20px;line-height:40px;">&nbsp;</div>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="660" border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF"
                        class="full-width" style="color: #949494">
                        <tbody>

                            <tr>
                                <td align="center">
                                    <span
                                        style="font-family : helvetica, arial; font-weight : bold; font-size: 16px; ">Where
                                        is my new password?</span>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div style="font-size:15px;line-height:15px;">&nbsp;</div>
                                </td>
                            </tr>

                            <tr>
                                <td align="center">
                                    <span class="pw-note" style="font-family: helvetica, arial;
                                                             font-size: 15px;
                                                             line-height: 22px;
                                                             display: block;">
                                        We will not make you remember other passwords or certain codes.<br>Just click the
                                        link and enter the new password as you wish
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td class="show">
                                    <div style="font-size:20px;line-height:0px;" class="line40">
                                        &nbsp;
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
@endsection

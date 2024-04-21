$('#inputGroupSelect02').change(function () {
    switch ($(this).val()) {
      case 'SRCIP':
        $('#SRCIP-NRO').css({ 'display': 'inline' });
        $('#DestIP-NRO').css({ 'display': 'none' });
        $('#Port-NRO').css({ 'display': 'none' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        break;
      case 'DestIP':
        $('#SRCIP-NRO').css({ 'display': 'none' });
        $('#Port-NRO').css({ 'display': 'none' });
        $('#DestIP-NRO').css({ 'display': 'inline' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        break;
      case 'SRCIPDest':
        $('#SRCIP-NRO').css({ 'display': 'inline' });
        $('#DestIP-NRO').css({ 'display': 'inline' });
        $('#Port-NRO').css({ 'display': 'none' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        break;
      case 'SRCIPPort':
        $('#SRCIP-NRO').css({ 'display': 'inline' });
        $('#Port-NRO').css({ 'display': 'inline' });
        $('#DestIP-NRO').css({ 'display': 'none' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        
        break;
        case 'DestIPPort':
        $('#DestIP-NRO').css({ 'display': 'inline' });
        $('#Port-NRO').css({ 'display': 'inline' });
        $('#SRCIP-NRO').css({ 'display': 'none' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        
        break;
        case 'IPPORTDEST':
        $('#DestIP-NRO').css({ 'display': 'inline' });
        $('#Port-NRO').css({ 'display': 'inline' });
        $('#SRCIP-NRO').css({ 'display': 'inline' });
        $('#ip').val("")
        $('#ipDest').val("")
        $('#Port-DestID').val("")
        
        break;
        default:
      $('#NULL').css({ 'display': 'inline' });
      break;
    }
  })

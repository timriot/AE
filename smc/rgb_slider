jQuery(document).ready(function() {

    $('div').each(function() {
        var th = $(this);
        hex = th.css('backgroundColor');
        rgb = hex.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        var red = rgb[1];
        var green = rgb[2];
        var blue = rgb[3];

        th.find('.r').val(red);
        th.find('.r').parent('span').siblings('input').val(red);
        th.find('.g').val(green);
        th.find('.g').parent('span').siblings('input').val(green);
        th.find('.b').val(blue);
        th.find('.b').parent('span').siblings('input').val(blue);

        $('input').bind('change keyup click', function() {

            if ($(this).hasClass('ch')) {

                $(this).parent('span').siblings('input').val($(this).val());

            }
            else {
                if ($(this).val() > 255) $(this).val(255);
                if ($(this).val() < 0) $(this).val(0);
                $(this).siblings('span').find('input').val($(this).val());
            }
            r = parseInt(th.find('.r').val()).toString(16);
            if (r.length == 1) r = '0' + r;

            g = parseInt(th.find('.g').val()).toString(16);
            if (g.length == 1) g = '0' + g;

            b = parseInt(th.find('.b').val()).toString(16);
            if (b.length == 1) b = '0' + b;

            x = r + g + b;

            th.find('.result').html(x);
            th.css('backgroundColor', '#' + x);

        });

    });

});
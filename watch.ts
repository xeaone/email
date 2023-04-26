import { serveDir } from 'https://deno.land/std@0.184.0/http/file_server.ts';
import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import template from './template.ts';

const result = template({

    // footerText: ['Footer Text'],
    // footerTitle: ['Footer Title'],

    // actionText: 'Action',
    // actionHref: '#action',

    // mainText: ['Main Text'],
    // mainTitle: ['Main Title'],

    // headerText: ['Header Text'],
    // headerTitle: ['Header Title'],

    title: 'Document Title',

    containers: [
        {
            // borderRadius: '4px',
            // color: '#000',
            // backgroundColor: '#eee',
            items: [
                { tag: 'h1', text: 'Title', style: { fontSize: '36px' } },
                { tag: 'p', text: 'Text 1' },
                { tag: 'p', text: 'Text 2' },
                {
                    tag: 'a',
                    text: 'Action',
                    attributes: {
                        href: '#action'
                    },
                    style: {
                        color: '#fff',
                        backgroundColor: '#000',
                    }
                },
            ],
        }
    ]

});

await Deno.writeTextFile('tmp/index.html', result);

await serve(req => serveDir(req, { fsRoot: 'tmp', showIndex: true }));

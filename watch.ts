import { serveDir } from 'https://deno.land/std@0.184.0/http/file_server.ts';
import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import template from './template.ts';

const result = template({

    title: 'Document Title',

    containers: [
        {
            style: {
                color: '#000',
                padding: '18px',
                borderRadius: '4px',
                backgroundColor: '#eee',
            },
            items: [
                {
                    tag: 'h1', text: 'Title',
                    style: {
                        fontSize: '36px'
                    }
                },
                {
                    tag: 'p',
                    text: 'Text 1',
                    style: {
                        fontSize: '18px'
                    }
                },
                {
                    tag: 'p',
                    text: 'Text 2',
                    style: {
                        fontSize: '18px'
                    }
                },
                {
                    tag: 'a',
                    text: 'Action',
                    attributes: {
                        href: '#action'
                    },
                    style: {
                        color: '#fff',
                        padding: '9px',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                    }
                },
            ],
        }
    ]

});

await Deno.writeTextFile('tmp/index.html', result);

await serve(req => serveDir(req, { fsRoot: 'tmp', showIndex: true }));

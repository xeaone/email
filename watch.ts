import { serveDir } from 'https://deno.land/std@0.184.0/http/file_server.ts';
import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import template from './template.ts';

const result = template({
    title: 'Document Title',
    rows: [
        {
            style: { margin: '9px' },
            columns: [
                {
                    style: { color: '#000', width: '100%', padding: '18px', maxWidth: '600px', minWidth: '300px', borderRadius: '4px', backgroundColor: '#eee' },
                    rows: [
                        {
                            columns: [{
                                elements: [{
                                    tag: 'h1', text: 'Title',
                                    style: { fontSize: '36px' }
                                }]
                            }]
                        },
                        {
                            columns: [{
                                elements: [{
                                    tag: 'p', text: 'Text',
                                    style: { fontSize: '18px' }
                                }]
                            }]
                        },
                        {
                            columns: [{
                                elements: [{
                                    tag: 'a', text: 'Action',
                                    attributes: { href: '#action' },
                                    style: { color: '#fff', padding: '9px', borderRadius: '4px', backgroundColor: '#000', textDecoration: 'none', display: 'inline-block' }
                                }]
                            }]
                        },
                    ],
                }
            ]
        }
    ]
});

await Deno.writeTextFile('tmp/index.html', result);

await serve(req => serveDir(req, { fsRoot: 'tmp', showIndex: true }));

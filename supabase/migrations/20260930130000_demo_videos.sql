-- PJ TV — videos de respaldo para las transmisiones de demostración.
update public.streams
set video_url = 'https://www.youtube.com/watch?v=eyPopYVzREo'
where id = 'e0000000-0000-4000-8000-000000000001';

update public.streams
set video_url = 'https://www.youtube.com/watch?v=fFko-yJP6Bk',
    title = 'Evita, 17 de octubre de 1951: proyección y debate',
    description = 'La Juventud de Lanús proyecta el primer discurso televisado de la historia argentina y abre el debate sobre la vigencia del legado de Evita.'
where id = 'e0000000-0000-4000-8000-000000000002';

update public.streams
set video_url = 'https://www.youtube.com/watch?v=NwtoEFVbFDA'
where id = 'e0000000-0000-4000-8000-000000000003';

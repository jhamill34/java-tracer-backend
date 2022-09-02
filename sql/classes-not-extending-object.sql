-- SQLite
select 
    c.name,
    ce.type,
    c2.name,
    c2.type
from class_entity c 
join class_closure_entity ce on ce.childId = c.id
join class_entity c2 on c2.id = ce.ancestorId
where c2.name <> 'java/lang/Object'
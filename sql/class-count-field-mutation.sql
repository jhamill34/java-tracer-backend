-- SQLite
select 
    count(*) as number_of_mutations,
    c.name as class_name
from class_entity c 
join method_entity m on m.classId = c.id
join instruction_entity i on i.ownerId = m.id
join reference_entity r on r.id = i.referenceId
where i.opCode in (179, 181) and m.name not in ('<init>', '<clinit>')
group by class_name 
;
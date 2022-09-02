-- SQLite
select 
    case i.opCode
        when 179
            then 'PUTSTATIC'
        when 181
            then 'PUTFIELD'
        ELSE '?'
    end opcode,
    i.lineNumber,
    c.name || '.' || m.name || m.descriptor as method_caller,
    r.className || '.' || r.name || ': ' || r.descriptor as mutated_field
from class_entity c 
join method_entity m on m.classId = c.id
join instruction_entity i on i.ownerId = m.id
join reference_entity r on r.id = i.referenceId
where i.opCode in (179, 181) and m.name not in ('<init>', '<clinit>')
;
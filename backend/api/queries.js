module.exports = {
    agendamentos:`
    select * from agendamento
	`,
    dashboard:`
    select
	row_to_json(t) as retiradassemana
from
	(with dados as (
	select
		to_char(ds.datasemana, 'DD/MM') as datasemana,
		(
		select
			count(*) as qtdresgates
		from
			promocaocliente pc
		inner join promocao p on
			p.id = pc.idpromocao
		where
			p.idfornecedor = ?
			and cast(pc.dataresgate as date) = ds.datasemana )
	from
		(
		select
			current_date - dias.n as datasemana
		from
			(
			select
				generate_series(6, 0,-1) as n) dias) ds)
	select
		array_agg(dados.datasemana) as datasemana,
		array_agg(dados.qtdresgates) as qtdresgates
	from
		dados)t
    `
}
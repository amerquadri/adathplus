export class Classlistofvalues {
    ValuesId?: number;
    Form: string='';
    Name: string='';
    Values?: string='';
    Details?: string='';
    CompanyId?: number;
}
interface ListValue {
  ValuesId: number;
  Form: string;
  Name: string;
  Values?: string | null;
  Details?: string | null;
}


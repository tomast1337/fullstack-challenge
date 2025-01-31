import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@frontend/components/ui/table';

export const MyProducts = () => {
  return (
    <section className='container mx-auto p-4 w-[900px]'>
      <h1 className='text-2xl font-bold mb-4'>My Products</h1>
      <div className='flex justify-center items-center flex-col w-full'>
        <div className='overflow-x-auto max-w-[900px] w-full'>
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='py-2 px-4 border-b'>Name</TableHead>
                <TableHead className='py-2 px-4 border-b'>Pice</TableHead>
                <TableHead className='py-2 px-4 border-b'>Category</TableHead>
                <TableHead className='py-2 px-4 border-b'>
                  Description
                </TableHead>
                <TableHead className='py-2 px-4 border-b'>price</TableHead>
                <TableHead className='py-2 px-4 border-b'>
                  Stock Quantity
                </TableHead>
                <TableHead className='py-2 px-4 border-b'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow></TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

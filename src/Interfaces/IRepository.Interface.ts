export interface IRepository<T> {
  create(item);
  update(item: T);
  getItems(page: number);
  findById(id: string);
  delete(item: T);
}

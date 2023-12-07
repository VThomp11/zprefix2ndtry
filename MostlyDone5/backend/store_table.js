/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    // await knex('store_table').del()
    await knex('store_table').insert([
        { id: 1, name: 'Ruby Necklace', type: 'Necklace', price: '$1200' },
        { id: 2, name: 'Emerald Necklace', type: 'Necklace', price: '$1800' },
        { id: 3, name: 'Pearl Necklace', type: 'Necklace' , price: '$1100'},
        { id: 4, name: 'Ruby Earrings', type: 'Earrings' , price: '$1050'},
        { id: 5, name: 'Emerald Earrings', type: 'Earrings' , price: '$1230'},
        { id: 6, name: 'Pearl Earrings', type: 'Earrings', price: '$12770' }
    ]);
};
